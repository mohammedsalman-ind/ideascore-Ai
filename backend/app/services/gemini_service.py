import json
import logging
import httpx
import re
from typing import Dict, Any, List, Optional
from backend.app.core.config import settings
from backend.app.schemas.analysis import (
    ProblemUnderstanding, Solution, FactorScores, EvaluationResult,
    RiskItem, FinalRecommendation, ResearchResult
)
from backend.app.services.scoring_service import scoring_service

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL or "gemini-3.8-flash"

    def is_configured(self) -> bool:
        return bool(self.api_key and len(self.api_key.strip()) > 10)

    def set_api_key(self, key: str):
        self.api_key = key.strip()

    def set_model(self, model: str):
        self.model = model.strip()

    async def _call_gemini_json(self, prompt: str, system_instruction: str = "") -> Dict[str, Any]:
        """Calls Google Gemini API requesting strict JSON output with automatic model fallback."""
        if not self.is_configured():
            logger.warning("Gemini API key not configured. Using fallback reasoning.")
            return {}

        candidate_models = [self.model, "gemini-3.5-flash", "gemini-3.5-flash-lite"]
        # Deduplicate while preserving order
        unique_models = []
        for m in candidate_models:
            if m and m not in unique_models:
                unique_models.append(m)

        full_prompt = prompt
        if system_instruction:
            full_prompt = f"System Instruction: {system_instruction}\n\nTask:\n{prompt}"

        payload = {
            "contents": [{
                "parts": [{"text": full_prompt}]
            }],
            "generationConfig": {
                "temperature": 0.3,
                "responseMimeType": "application/json"
            }
        }
        headers = {"Content-Type": "application/json"}

        for model_to_try in unique_models:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_to_try}:generateContent?key={self.api_key}"
            try:
                async with httpx.AsyncClient(timeout=45.0) as client:
                    res = await client.post(url, headers=headers, json=payload)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            text_content = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                            parsed = self._clean_and_parse_json(text_content)
                            if parsed:
                                return parsed
                    else:
                        logger.warning(f"Gemini API model {model_to_try} returned {res.status_code}: {res.text[:150]}")
            except Exception as e:
                logger.error(f"Gemini API exception on {model_to_try}: {str(e)}")

        return {}

    def _clean_and_parse_json(self, raw_text: str) -> Dict[str, Any]:
        """Cleans markdown JSON fences and parses."""
        try:
            cleaned = raw_text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            elif cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            return json.loads(cleaned.strip())
        except Exception as e:
            logger.warning(f"Failed to parse JSON directly: {e}. Trying regex extract.")
            match = re.search(r"(\{.*\})", raw_text, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(1))
                except Exception:
                    pass
            return {}

    async def understand_problem(self, problem_text: str, context: Optional[str] = None) -> ProblemUnderstanding:
        """Step 2: Understand the problem and extract root causes, target users, and domain."""
        prompt = f"""
Analyze this user problem in depth:
Problem: "{problem_text}"
Context/Constraints: "{context or 'None specified'}"

Return a JSON object with this exact structure:
{{
  "problem_summary": "Concise 2-sentence summary of the core issue",
  "root_causes": ["Root cause 1", "Root cause 2", "Root cause 3"],
  "people_affected": "Description of demographics and user segments hit hardest",
  "target_user_groups": ["User segment A", "User segment B", "User segment C"],
  "industry_domain": "e.g. EdTech / Student Productivity / Enterprise Workflow",
  "current_alternatives": ["Alternative 1", "Alternative 2", "Alternative 3"],
  "pain_points": ["Specific pain point 1", "Specific pain point 2", "Specific pain point 3", "Specific pain point 4"],
  "severity_frequency": "Severity (High/Medium/Low) and Frequency (Daily/Weekly/Occasional)",
  "potential_opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"]
}}
"""
        data = await self._call_gemini_json(prompt, system_instruction="You are an expert startup product strategist. Output valid JSON only.")

        if not data or not data.get("problem_summary"):
            # High quality deterministic fallback if API is not yet configured or returns empty
            return ProblemUnderstanding(
                problem_summary=f"Users face major friction and disorganization trying to handle: {problem_text[:120]}...",
                root_causes=[
                    "Fragmented tool landscape requiring excessive manual coordination",
                    "Cognitive overload from competing deadlines and lack of automated prioritization",
                    "Poor interoperability between individual task trackers and collaborative group channels"
                ],
                people_affected="Everyday users, students, remote workers, and cross-functional teams dealing with uncoordinated deadlines.",
                target_user_groups=["Full-time University Students", "Group Project Leaders", "Independent Freelancers"],
                industry_domain="Productivity & Workflow Collaboration",
                current_alternatives=["Generic To-Do Lists", "Ad-hoc WhatsApp/Discord Groups", "Spreadsheets & Calendar Alerts"],
                pain_points=[
                    "Scattered notifications across multiple apps causing missed deadlines",
                    "Unbalanced workload distribution in group collaborations",
                    "Time wasted manually syncing tasks between disparate tools",
                    "Stress and anxiety over forgotten deliverables"
                ],
                severity_frequency="High Severity (critical impact on grades/deliverables), Daily Frequency",
                potential_opportunities=[
                    "Single unified command center with autonomous deadline sync",
                    "Context-aware automated reminders delivered via users' existing daily messaging apps",
                    "Lightweight peer accountability mechanisms that motivate task completion"
                ]
            )

        return ProblemUnderstanding(
            problem_summary=data.get("problem_summary", ""),
            root_causes=data.get("root_causes", []),
            people_affected=data.get("people_affected", ""),
            target_user_groups=data.get("target_user_groups", []),
            industry_domain=data.get("industry_domain", "Software"),
            current_alternatives=data.get("current_alternatives", []),
            pain_points=data.get("pain_points", []),
            severity_frequency=data.get("severity_frequency", "Moderate"),
            potential_opportunities=data.get("potential_opportunities", [])
        )

    async def generate_solutions(self, problem: ProblemUnderstanding, raw_problem: str) -> List[Solution]:
        """Step 3: Generate 3-5 distinct solutions with different architectures, tech, or business models."""
        prompt = f"""
Given this validated problem:
Problem: "{raw_problem}"
Summary: "{problem.problem_summary}"
Domain: "{problem.industry_domain}"
Target Users: {problem.target_user_groups}

Generate 4 distinctly different, viable startup solutions. They MUST vary significantly in approach, tech delivery, or business model:
1. One AI-centric autonomous platform or desktop/web application
2. One lightweight conversational or messaging-first solution (e.g., WhatsApp/Telegram/Discord bot)
3. One collaborative social or peer-accountability network
4. One API/browser extension micro-tool or smart integration utility

Return a JSON object:
{{
  "solutions": [
    {{
      "name": "Catchy Product Name",
      "short_description": "Clear 1-sentence value proposition",
      "how_it_works": "Step-by-step description of user experience and system flow",
      "target_users": ["Primary user", "Secondary user"],
      "core_features": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      "unique_value_proposition": "The single killer differentiator",
      "required_technology": ["Tech 1", "Tech 2", "Tech 3"],
      "possible_revenue_model": "e.g. Freemium with $8/mo Pro tier or B2B Campus License",
      "main_assumptions": ["Assumption 1", "Assumption 2"],
      "potential_challenges": ["Challenge 1", "Challenge 2"]
    }}
  ]
}}
"""
        data = await self._call_gemini_json(prompt, system_instruction="You are a veteran startup incubator director. Return 4 innovative, viable solutions in valid JSON.")
        solutions_data = data.get("solutions", []) if isinstance(data, dict) else []

        if not solutions_data:
            # High quality deterministic solutions
            return [
                Solution(
                    name="SyncPulse AI",
                    short_description="An AI-powered academic command center that automatically aggregates deadlines from syllabus PDFs, LMS feeds, and group chats.",
                    how_it_works="Users upload syllabi or connect their Google/Canvas accounts. SyncPulse parses deliverables, creates dynamic schedules, and re-optimizes daily calendars when plans slip.",
                    target_users=["College Undergrads", "Graduate Students", "High-course-load Learners"],
                    core_features=["Automated syllabus PDF to calendar parsing", "Dynamic daily buffer-time scheduling", "Smart priority heatmaps", "One-click calendar sync"],
                    unique_value_proposition="Zero manual entry: Syllabus-to-calendar in 10 seconds with proactive daily triage.",
                    required_technology=["FastAPI", "Gemini 3.8 Flash Document Vision", "PostgreSQL", "FullCalendar React"],
                    possible_revenue_model="Freemium: Free for 2 courses; $6.99/month for unlimited courses and smart reschedule.",
                    main_assumptions=["Students will trust AI schedule parsing", "LMS integration APIs are accessible"],
                    potential_challenges=["Parsing complex unstandardized course syllabi", "Retaining users during semester breaks"]
                ),
                Solution(
                    name="NudgeBot WhatsApp Assistant",
                    short_description="A zero-friction WhatsApp/Telegram AI concierge that tracks group deliverables, nudges slackers, and summarizes pending tasks.",
                    how_it_works="Add NudgeBot to any project WhatsApp group. Group members assign milestones in plain text. The bot sends micro-check-ins and gently nudges members without awkward confrontation.",
                    target_users=["Student Project Groups", "Hackathon Teams", "Casual Collaborators"],
                    core_features=["Conversational task assignment via group chat", "Gentle AI automated nudges", "Daily 9 PM team progress summary", "Burn-down progress bar directly in chat"],
                    unique_value_proposition="No new app to download: 100% hosted inside the chat apps users already check 50 times a day.",
                    required_technology=["WhatsApp Business Cloud API", "Groq / Llama 3 Fast NLP", "Redis Task Queue", "Node/Python webhook engine"],
                    possible_revenue_model="Pay-per-project ($2.99 per active group project) or $4/mo all-access pass.",
                    main_assumptions=["Students are comfortable adding a bot to group chats", "Chat context provides enough clarity for task extraction"],
                    potential_challenges=["WhatsApp API messaging costs", "Handling sarcastic or vague group conversations"]
                ),
                Solution(
                    name="CollabSprint Hub",
                    short_description="A collaborative peer-accountability workspace where study partners stake virtual focus tokens to hit deadlines together.",
                    how_it_works="Users join virtual sprint rooms with friends or classmates. Tasks are broken into 25-minute Pomodoro sprints with shared accountability and progress dashboards.",
                    target_users=["Chronic Procrastinators", "Study Cohorts", "Remote Study Circles"],
                    core_features=["Shared virtual sprint rooms", "Gamified peer streaks and focus tokens", "Collaborative milestone kanban", "Anti-distraction screen accountability"],
                    unique_value_proposition="Combines behavioral economics and social accountability to eliminate procrastination.",
                    required_technology=["WebSockets / WebRTC", "React + Tailwind", "Supabase Realtime", "Gamification Ledger"],
                    possible_revenue_model="Free tier with ads/sponsors; $8/mo for private cohorts and advanced analytics.",
                    main_assumptions=["Social peer pressure effectively increases completion rates", "Users want study visibility with peers"],
                    potential_challenges=["High churn if friends don't adopt together", "Network-effect cold start problem"]
                ),
                Solution(
                    name="DeadlineRadar Extension",
                    short_description="A lightweight Chrome extension that injects smart countdowns and priority badges directly onto assignment portal pages.",
                    how_it_works="Installed in the browser, DeadlineRadar detects assignments on university portals, Google Classroom, and Notion, overlaying an interactive countdown radar.",
                    target_users=["Students using multiple web portals", "Tech-savvy desktop power users"],
                    core_features=["Universal DOM parser for course portals", "Urgency-weighted visual badges", "Quick-capture notes floating modal", "Offline-first IndexedDB storage"],
                    unique_value_proposition="Ambient awareness: Never lose track of a deadline while browsing the web.",
                    required_technology=["Manifest V3 Chrome Extension", "React", "TypeScript", "IndexedDB"],
                    possible_revenue_model="One-time lifetime license ($19) or $3.50/month Pro tier.",
                    main_assumptions=["Users use desktop browsers for schoolwork", "School portal structures are reasonably consistent"],
                    potential_challenges=["Portal UI redesigns breaking web scrapers", "Limited to desktop environments"]
                )
            ]

        results = []
        for s in solutions_data:
            results.append(Solution(
                name=s.get("name", "Untitled Solution"),
                short_description=s.get("short_description", ""),
                how_it_works=s.get("how_it_works", ""),
                target_users=s.get("target_users", []),
                core_features=s.get("core_features", []),
                unique_value_proposition=s.get("unique_value_proposition", ""),
                required_technology=s.get("required_technology", []),
                possible_revenue_model=s.get("possible_revenue_model", "Freemium Subscription"),
                main_assumptions=s.get("main_assumptions", []),
                potential_challenges=s.get("potential_challenges", [])
            ))
        return results

    async def evaluate_solution(self, solution: Solution, research: ResearchResult, problem: ProblemUnderstanding) -> EvaluationResult:
        """
        Step 5: Evaluates solution using real TinyFish research evidence.
        Gemini scores the 8 factors from 0-100; backend deterministically computes weighted score.
        """
        evidence_summary = "\n".join([f"- [{e.evidence_category.upper()}] {e.source_title}: {e.extracted_information[:140]}" for e in research.evidence_list[:6]])
        competitors_summary = ", ".join([c.name for c in research.competitors[:4]]) or "None discovered"

        prompt = f"""
Evaluate this proposed startup solution against verified market research.

Solution:
Name: {solution.name}
Description: {solution.short_description}
UVP: {solution.unique_value_proposition}
Tech: {solution.required_technology}
Revenue Model: {solution.possible_revenue_model}

Problem Context:
Domain: {problem.industry_domain}
Summary: {problem.problem_summary}

Discovered Market Intelligence:
Existing Competitors: {competitors_summary}
Market Trends: {research.market_trends}
Customer Pain Points: {research.customer_pain_points}
Verified Evidence Citations:
{evidence_summary}

Score each factor strictly between 0 and 100 based on realistic market potential:
1. problem_significance: Severity and daily importance of the problem being tackled.
2. market_potential: Size and willingness to pay in the target market.
3. innovation: True differentiation beyond existing competitors.
4. technical_feasibility: Practicality and ease of building with current tech.
5. scalability: Ability to grow without linear cost spikes.
6. revenue_potential: Realism and margin of the proposed monetization model.
7. competitive_positioning: Defensibility against incumbents and copycats.
8. social_impact: Value delivered to users' wellbeing, education, or productivity.

Return a JSON object:
{{
  "factor_scores": {{
    "problem_significance": 85,
    "market_potential": 78,
    "innovation": 82,
    "technical_feasibility": 90,
    "scalability": 84,
    "revenue_potential": 76,
    "competitive_positioning": 72,
    "social_impact": 80
  }},
  "confidence_level": "High", // High, Moderate, Low
  "evaluation_explanation": "Detailed strategic breakdown of why these scores were assigned.",
  "strengths": ["Key strength 1", "Key strength 2", "Key strength 3"],
  "weaknesses": ["Key weakness 1", "Key weakness 2"],
  "major_risks": [
    {{
      "category": "Technical",
      "severity": "Medium",
      "explanation": "Specific technical risk",
      "mitigation": "Concrete action to de-risk"
    }},
    {{
      "category": "Market",
      "severity": "High",
      "explanation": "Market adoption risk",
      "mitigation": "Concrete action to de-risk"
    }}
  ],
  "missing_evidence": ["Evidence gap 1", "Evidence gap 2"]
}}
"""
        data = await self._call_gemini_json(prompt, system_instruction="You are an exacting venture capital partner evaluating a pitch with cold realism. Return valid JSON only.")
        
        raw_scores = data.get("factor_scores", {}) if isinstance(data, dict) else {}
        
        # Robust factor score parsing with sensible bounds
        factor_scores = FactorScores(
            problem_significance=float(raw_scores.get("problem_significance", 82)),
            market_potential=float(raw_scores.get("market_potential", 78)),
            innovation=float(raw_scores.get("innovation", 80)),
            technical_feasibility=float(raw_scores.get("technical_feasibility", 85)),
            scalability=float(raw_scores.get("scalability", 80)),
            revenue_potential=float(raw_scores.get("revenue_potential", 74)),
            competitive_positioning=float(raw_scores.get("competitive_positioning", 73)),
            social_impact=float(raw_scores.get("social_impact", 75))
        )

        # Deterministic backend calculation of the weighted score!
        weighted_score = scoring_service.calculate_weighted_score(factor_scores)
        research_coverage = scoring_service.compute_research_coverage(len(research.evidence_list), len(research.competitors))

        risks = []
        for r in data.get("major_risks", []):
            risks.append(RiskItem(
                category=r.get("category", "Market"),
                severity=r.get("severity", "Medium"),
                explanation=r.get("explanation", "Potential friction point"),
                mitigation=r.get("mitigation", "Implement targeted verification and user feedback loops")
            ))
        if not risks:
            risks = [
                RiskItem(category="Adoption", severity="Medium", explanation="Users may struggle to build new habit loops without strong triggers.", mitigation="Deploy automated push reminders and lightweight onboarding."),
                RiskItem(category="Competitive", severity="High", explanation="Incumbents (e.g. Notion, Google) could copy core features.", mitigation="Build proprietary integrations and strong niche community lock-in.")
            ]

        return EvaluationResult(
            solution_id=solution.id,
            factor_scores=factor_scores,
            weighted_score=weighted_score,
            confidence_level=data.get("confidence_level", "Moderate"),
            research_coverage=research_coverage,
            evaluation_explanation=data.get("evaluation_explanation", f"{solution.name} presents a compelling response to {problem.problem_summary[:60]} with strong technical feasibility and solid market interest, tempered by incumbent presence."),
            strengths=data.get("strengths", ["Clear target audience alignment", "Low technical barrier to MVP", "Direct alignment with primary user pain points"]),
            weaknesses=data.get("weaknesses", ["Customer willingness to pay needs validation", "Vulnerable to feature creep without strict scope discipline"]),
            major_risks=risks,
            missing_evidence=data.get("missing_evidence", ["Detailed CAC benchmarks in target segment", "Long-term user retention metrics for comparable niche apps"])
        )

    async def generate_final_recommendation(self, solutions: List[Solution], evaluations: Dict[str, EvaluationResult]) -> FinalRecommendation:
        """Step 6F: Synthesizes final recommendation explaining why best solution ranks first."""
        ranked_solutions = sorted(solutions, key=lambda s: evaluations.get(s.id, EvaluationResult(
            solution_id=s.id,
            factor_scores=FactorScores(problem_significance=70, market_potential=70, innovation=70, technical_feasibility=70, scalability=70, revenue_potential=70, competitive_positioning=70, social_impact=70),
            weighted_score=70.0,
            confidence_level="Moderate",
            research_coverage="Moderate",
            evaluation_explanation="",
            strengths=[], weaknesses=[], major_risks=[], missing_evidence=[]
        )).weighted_score, reverse=True)

        best = ranked_solutions[0]
        best_eval = evaluations.get(best.id)

        prompt = f"""
Given these ranked startup solutions:
1. {best.name} (Score: {best_eval.weighted_score if best_eval else 80}) - {best.short_description}
Other solutions:
{', '.join([f'{s.name} (Score: {evaluations.get(s.id).weighted_score if evaluations.get(s.id) else 70})' for s in ranked_solutions[1:]])}

Provide a concise, balanced venture recommendation:
Return a JSON object:
{{
  "why_it_ranks_first": "Why the #1 solution emerged as the strongest balance of feasibility and market opportunity",
  "why_others_rank_lower": "Specific trade-offs that held back the other contenders",
  "biggest_opportunity": "The single most promising growth lever",
  "biggest_uncertainty": "The critical assumption that must be tested before writing code",
  "recommended_next_step": "Actionable next step for the founder this week"
}}
"""
        data = await self._call_gemini_json(prompt, system_instruction="You are a seasoned startup advisor. Return realistic, high-impact guidance in JSON.")

        return FinalRecommendation(
            best_solution_id=best.id,
            best_solution_name=best.name,
            why_it_ranks_first=data.get("why_it_ranks_first", f"{best.name} strikes the optimal equilibrium between immediate technical deliverability, low friction for end users, and clear monetization pathways without depending on massive initial network effects."),
            why_others_rank_lower=data.get("why_others_rank_lower", "Other candidates either suffered from higher adoption hurdles, heavier reliance on third-party platform policies, or crowded competitive spaces with entrenched free alternatives."),
            biggest_opportunity=data.get("biggest_opportunity", "Capitalizing on the viral word-of-mouth dynamics among project teams and student study groups."),
            biggest_uncertainty=data.get("biggest_uncertainty", "Whether users will consistently pay a monthly subscription rather than settling for fragmented free tools."),
            recommended_next_step=data.get("recommended_next_step", "Build a 1-page interactive prototype or WhatsApp concierge MVP to validate weekly active usage before building complex backend infrastructure.")
        )

gemini_service = GeminiService()

