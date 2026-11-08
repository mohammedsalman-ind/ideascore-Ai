import logging
from typing import List, Dict, Any, Optional
from backend.app.schemas.analysis import Solution, ProblemUnderstanding, ResearchResult
from backend.app.schemas.modules import (
    MarketGapItem, FeasibilityReport, BusinessModelOption,
    SWOTReport, CustomerValidationReport, SharkTankMessage
)
from backend.app.services.gemini_service import gemini_service

logger = logging.getLogger(__name__)

class ModulesService:
    async def find_market_gaps(self, solution: Solution, problem: ProblemUnderstanding, research: ResearchResult) -> List[MarketGapItem]:
        """Module 1: Identifies market gaps and white spaces competitors overlook."""
        prompt = f"""
Identify 4 high-value market gaps and unserved opportunities in:
Domain: {problem.industry_domain}
Problem: {problem.problem_summary}
Solution Idea: {solution.name} - {solution.short_description}
Competitors: {[c.name for c in research.competitors]}
Customer Pain Points: {research.customer_pain_points}

Return JSON:
{{
  "gaps": [
    {{
      "gap_title": "Catchy title for the gap",
      "market_gap": "Exact description of what competitors are missing",
      "evidence_observed": "Why this gap exists based on current tool behavior",
      "customer_pain_point": "Specific customer frustration created by this gap",
      "opportunity_description": "How a new entrant can capitalize on it",
      "possible_differentiation": "Specific feature or mechanic to win this gap"
    }}
  ]
}}
"""
        data = await gemini_service._call_gemini_json(prompt, system_instruction="You are a market intelligence analyst. Output valid JSON only.")
        gaps_data = data.get("gaps", []) if isinstance(data, dict) else []

        if not gaps_data:
            return [
                MarketGapItem(
                    gap_title="Zero-Touch Ingestion vs Manual Setup",
                    market_gap="Incumbent tools like Notion and Asana require extensive manual configuration and discipline, leading to high drop-off.",
                    evidence_observed="Competitor reviews on G2 and Reddit cite onboarding friction as the #1 reason teams abandon project tools.",
                    customer_pain_point="Users spend more time organizing tasks than actually executing them.",
                    opportunity_description="Provide completely autonomous parsing (from syllabus PDFs, emails, chat feeds) that sets up the system in under 15 seconds.",
                    possible_differentiation="Proprietary OCR and document intelligence engine that auto-detects deadlines."
                ),
                MarketGapItem(
                    gap_title="Affordable Micro-SaaS vs Bloated Enterprise Tiers",
                    market_gap="Incumbents bundle hundreds of irrelevant enterprise features into expensive $15-$30/user/month plans.",
                    evidence_observed="Students and micro-teams actively avoid standard project management suites due to steep monthly costs.",
                    customer_pain_point="Cost barrier for solo users and student project teams with zero budget.",
                    opportunity_description="Offer a streamlined $4-$6/mo tier or freemium campus model with focus strictly on essentials.",
                    possible_differentiation="Lean, fast interface with zero bloat and generous student verification pricing."
                ),
                MarketGapItem(
                    gap_title="Native Messaging Presence vs Isolated App Silo",
                    market_gap="Most tools exist only inside web apps or dedicated mobile apps that users frequently forget to check.",
                    evidence_observed="Messaging platforms (WhatsApp, Telegram, Discord) have 10x higher daily open rates than project management dashboards.",
                    customer_pain_point="Notifications get buried in spam or forgotten inside un-opened apps.",
                    opportunity_description="Deliver proactive nudges and task summaries directly inside users' existing messaging streams.",
                    possible_differentiation="Two-way messaging bots allowing conversational status updates without launching a dashboard."
                )
            ]

        return [MarketGapItem(**g) for g in gaps_data]

    async def analyze_feasibility(self, solution: Solution) -> FeasibilityReport:
        """Module 2: Evaluates development effort, tech stack, complexity, and dependencies."""
        prompt = f"""
Analyze the technical feasibility and engineering scope for building an MVP of this startup:
Name: {solution.name}
Description: {solution.short_description}
Tech: {solution.required_technology}

Return JSON:
{{
  "required_skills": ["Skill 1", "Skill 2", "Skill 3"],
  "technology_stack": ["Tech A", "Tech B", "Tech C", "Tech D"],
  "development_complexity": "Medium", // Low, Medium, High, Very High
  "approximate_effort_weeks": "4-6 weeks for functional MVP",
  "core_dependencies": ["Dependency 1", "Dependency 2"],
  "infrastructure_requirements": ["Cloud infra item 1", "Cloud infra item 2"],
  "feasibility_notes": "Pragmatic engineering summary of potential bottlenecks and architectural recommendations."
}}
"""
        data = await gemini_service._call_gemini_json(prompt, system_instruction="You are a Principal Software Architect. Output valid JSON only.")

        return FeasibilityReport(
            solution_id=solution.id,
            required_skills=data.get("required_skills", ["Full-stack React/TypeScript", "Python/FastAPI Backend", "LLM Prompt Engineering & Document Parsing", "Relational Database Design"]),
            technology_stack=data.get("technology_stack", solution.required_technology or ["React", "FastAPI", "PostgreSQL", "Supabase", "Tailwind CSS"]),
            development_complexity=data.get("development_complexity", "Medium"),
            approximate_effort_weeks=data.get("approximate_effort_weeks", "3-5 weeks for functional MVP"),
            core_dependencies=data.get("core_dependencies", ["Cloud Document Vision / OCR API", "Fast Embeddings / Vector Store", "Third-party Calendar OAuth"]),
            infrastructure_requirements=data.get("infrastructure_requirements", ["Managed PostgreSQL on Supabase", "Stateless FastAPI container on Railway / Render", "Redis cache for rate limiting"]),
            feasibility_notes=data.get("feasibility_notes", "The architecture relies predominantly on standard REST APIs and managed services, making MVP delivery rapid and cost-effective. The primary technical hurdle is robust document extraction across varied PDF/syllabus layouts.")
        )

    async def generate_business_models(self, solution: Solution, problem: ProblemUnderstanding) -> List[BusinessModelOption]:
        """Module 3: Proposes and compares viable monetization models."""
        prompt = f"""
Evaluate suitable business models for this startup:
Name: {solution.name}
Description: {solution.short_description}
Target Users: {solution.target_users}
Domain: {problem.industry_domain}

Evaluate these 4 models:
1. Freemium Subscription
2. Pay-per-use / Microtransactions
3. Team / Campus Department License (B2B)
4. Lifetime License / One-Time Purchase

Return JSON:
{{
  "models": [
    {{
      "model_type": "Freemium Subscription",
      "pricing_structure": "$0 free tier (2 courses) / $6.99/mo Pro",
      "target_paying_customer": "Power users with heavy workloads",
      "why_it_works": "Predictable recurring revenue with low barrier to try",
      "why_it_might_fail": "High conversion friction if free tier is too generous",
      "recommended": true
    }}
  ]
}}
"""
        data = await gemini_service._call_gemini_json(prompt, system_instruction="You are a SaaS monetization strategist. Output valid JSON only.")
        models_data = data.get("models", []) if isinstance(data, dict) else []

        if not models_data:
            return [
                BusinessModelOption(
                    model_type="Freemium Subscription",
                    pricing_structure="Free Starter (up to 2 active projects/courses) / $6.99/month Pro tier",
                    target_paying_customer="Students and independent professionals managing heavy ongoing schedules",
                    why_it_works="Zero barrier to initial adoption, organic viral invitation, predictable ARR",
                    why_it_might_fail="Summer and semester breaks lead to seasonal churn spikes",
                    recommended=True
                ),
                BusinessModelOption(
                    model_type="B2B Campus / Team Licensing",
                    pricing_structure="$400 - $1,500/year per academic department or project incubator cohort",
                    target_paying_customer="Universities, department heads, and startup incubators looking to improve cohort completion rates",
                    why_it_works="High contract value, zero seasonal churn, institutional budget funding",
                    why_it_might_fail="Long enterprise procurement cycles (3-9 months)",
                    recommended=False
                ),
                BusinessModelOption(
                    model_type="Pay-Per-Project Pass",
                    pricing_structure="$2.99 per completed project sprint or $19 semester pass",
                    target_paying_customer="Students with short-term project urgency who reject recurring subscriptions",
                    why_it_works="Matches students' discrete budget horizons without subscription anxiety",
                    why_it_might_fail="Lower customer lifetime value (LTV) requires constant top-of-funnel acquisition",
                    recommended=False
                ),
                BusinessModelOption(
                    model_type="Lifetime Access License",
                    pricing_structure="$49 one-time payment with 1 year of included AI sync updates",
                    target_paying_customer="Early adopter productivity power users",
                    why_it_works="Immediate upfront cash flow to fund initial runway",
                    why_it_might_fail="Fails to cover ongoing LLM and server compute costs long-term",
                    recommended=False
                )
            ]

        return [BusinessModelOption(**m) for m in models_data]

    async def generate_swot(self, solution: Solution, research: ResearchResult) -> SWOTReport:
        """Module 4: Generates comprehensive SWOT analysis."""
        prompt = f"""
Perform a rigorous SWOT analysis for:
Startup: {solution.name}
Description: {solution.short_description}
UVP: {solution.unique_value_proposition}
Competitors: {[c.name for c in research.competitors]}

Return JSON:
{{
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "weaknesses": ["Weakness 1", "Weakness 2", "Weakness 3"],
  "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
  "threats": ["Threat 1", "Threat 2", "Threat 3"],
  "strategic_takeaway": "1-2 sentence core conclusion"
}}
"""
        data = await gemini_service._call_gemini_json(prompt, system_instruction="You are a senior business strategist. Output valid JSON only.")

        return SWOTReport(
            solution_id=solution.id,
            strengths=data.get("strengths", ["Frictionless onboarding eliminating manual entry", "Sharp focus on deadline triage rather than generic note-taking", "Agile tech stack with low operational overhead"]),
            weaknesses=data.get("weaknesses", ["Brand awareness deficit compared to established giants", "Reliance on user-provided document quality for OCR parsing", "Early-stage unit economics depend on LLM token costs"]),
            opportunities=data.get("opportunities", ["Integration partnerships with campus LMS platforms (Canvas, Blackboard)", "Expanding into corporate agile team sprint management", "Monetizing verified anonymized study workflow benchmarks"]),
            threats=data.get("threats", ["Google Workspace or Notion natively launching identical automated scheduling features", "Consumer resistance to recurring monthly software subscriptions", "API rate limits or pricing changes by foundation model providers"]),
            strategic_takeaway=data.get("strategic_takeaway", f"{solution.name} can carve out a lucrative niche by moving significantly faster than bureaucratic incumbents, provided it cements deep campus distribution and high weekly engagement before copycats emerge.")
        )

    async def generate_customer_validation(self, solution: Solution, problem: ProblemUnderstanding) -> CustomerValidationReport:
        """Module 5: Generates customer discovery interview questions and validation experiments."""
        prompt = f"""
Generate an actionable customer validation toolkit for:
Idea: {solution.name} - {solution.short_description}
Target Users: {problem.target_user_groups}
Core Pain Points: {problem.pain_points}

Include:
1. Target customer segments
2. 5 Mom Test style customer interview questions (never asking 'would you buy this?')
3. 4 survey questions with quantifiable scales
4. 3 low-cost validation experiments
5. 2 landing page test copy & CTA ideas
6. Key assumptions to validate first

Return JSON:
{{
  "target_customer_segments": ["Segment A", "Segment B"],
  "interview_questions": ["Q1", "Q2", "Q3", "Q4", "Q5"],
  "survey_questions": ["SQ1", "SQ2", "SQ3", "SQ4"],
  "validation_experiments": ["Exp 1", "Exp 2", "Exp 3"],
  "landing_page_testing_ideas": ["LP 1", "LP 2"],
  "key_assumptions_to_test": ["Assumption 1", "Assumption 2", "Assumption 3"]
}}
"""
        data = await gemini_service._call_gemini_json(prompt, system_instruction="You are a customer discovery coach trained on The Mom Test and Lean Startup. Output valid JSON only.")

        return CustomerValidationReport(
            solution_id=solution.id,
            target_customer_segments=data.get("target_customer_segments", ["College undergraduates taking 4+ concurrent courses", "Student project group team leads", "Independent freelance consultants"]),
            interview_questions=data.get("interview_questions", [
                "Walk me through the exact steps you took the last time you missed or almost missed a critical deadline.",
                "How much time did you spend last Sunday organizing your tasks for the week, and what tools did you open?",
                "What is the most frustrating part of coordinating deliverables with peers in group chats?",
                "What software tools have you actually paid money for out of your own pocket in the last 12 months?",
                "What workaround or spreadsheet have you built yourself because existing apps let you down?"
            ]),
            survey_questions=data.get("survey_questions", [
                "On a scale of 1-10, how frequently do uncoordinated deadlines cause stress during your week?",
                "How many distinct apps (Notion, Calendar, WhatsApp, Canvas, Email) do you check daily for deliverables?",
                "If a tool automatically synced all your syllabus deadlines in 10 seconds, how likely would you be to test it? (1-10)",
                "What is the maximum you would pay monthly for zero-friction deadline management? ($0, $3, $7, $15+)"
            ]),
            validation_experiments=data.get("validation_experiments", [
                "Smoke Test: Launch a 1-page Carrd site showcasing the syllabus parser with a 'Request Early Access' button tracking click-through rate.",
                "Concierge MVP: Manually convert 20 student syllabi into Google Calendar events in 24 hours to observe user satisfaction and referral rates.",
                "Community Post: Share a before/after visualization of a messy group chat vs a clean summary card on campus Reddit/Discord and measure inbound DMs."
            ]),
            landing_page_testing_ideas=data.get("landing_page_testing_ideas", [
                "Headline A: 'Upload Your Course Syllabi. Never Miss a Deadline Again.' with CTA: 'Import My Syllabi Free'",
                "Headline B: 'Stop Being the Group Project Sitter. Let AI Coordinate Deadlines.' with CTA: 'Add Bot to WhatsApp'"
            ]),
            key_assumptions_to_test=data.get("key_assumptions_to_test", [
                "Users will upload personal course documents to a third-party AI tool",
                "Students feel enough pain to switch from default Google Calendar/Apple Reminders",
                "Group project members will respond to bot nudges without feeling micromanaged"
            ])
        )

    async def pitch_shark_tank(self, solution: Solution, user_message: Optional[str] = None, history: Optional[List[Dict[str, str]]] = None) -> List[SharkTankMessage]:
        """Module 6: AI Shark Tank Interactive Investor Panel."""
        from datetime import datetime

        if not user_message:
            # Initial pitch opening from the sharks
            return [
                SharkTankMessage(
                    sender="Investor: Elena Vance (Fintech & SaaS Partner)",
                    avatar_color="#10b981", # neon green
                    text=f"Welcome to the Tank. I've reviewed your pitch for {solution.name}. You claim you can validate and solve '{solution.short_description}'. My first question is about unit economics: In consumer productivity, churn is brutal. How do you plan to keep 30-day retention above 25% without burning cash on ads?",
                    timestamp=datetime.utcnow().strftime("%I:%M %p")
                ),
                SharkTankMessage(
                    sender="Investor: Marcus Reed (Product Purist & Serial Founder)",
                    avatar_color="#3b82f6", # blue
                    text=f"Elena's right on the numbers, but I care about the product moat. What stops Notion or Apple from adding this exact feature next month? Why should I write a $250k check into {solution.name} rather than investing in an enterprise workflow company?",
                    timestamp=datetime.utcnow().strftime("%I:%M %p")
                )
            ]

        # Process user's response through Gemini
        prompt = f"""
You are simulating an AI Shark Tank panel with two distinct investor personas evaluating a startup pitch:
Startup: {solution.name} ({solution.short_description})
Revenue Model: {solution.possible_revenue_model}

User's Pitch / Answer: "{user_message}"

Generate responses from the two investors:
1. Elena Vance (SaaS Partner): Analytical, cares about CAC, LTV, conversion, and defensible economics.
2. Marcus Reed (Product Purist): Blunt, cares about product moat, retention mechanics, and speed to market.

Return JSON:
{{
  "elena_response": "Elena's direct reaction and follow-up question or offer",
  "marcus_response": "Marcus's critique and reaction"
}}
"""
        data = await gemini_service._call_gemini_json(prompt, system_instruction="You are roleplaying savvy venture capitalists on Shark Tank. Be incisive, tough, and realistic.")
        
        t = datetime.utcnow().strftime("%I:%M %p")
        return [
            SharkTankMessage(
                sender="Investor: Elena Vance (Fintech & SaaS Partner)",
                avatar_color="#10b981",
                text=data.get("elena_response", "That's a fair point on organic distribution, but I need to see verified conversion numbers. If you can show me 100 paying users within 60 days, I might consider a strategic seed check."),
                timestamp=t
            ),
            SharkTankMessage(
                sender="Investor: Marcus Reed (Product Purist & Serial Founder)",
                avatar_color="#3b82f6",
                text=data.get("marcus_response", "I like that you understand the user frustration. But execution is everything here. Show me that users keep this open all day, and I'll fight Elena for the deal."),
                timestamp=t
            )
        ]

modules_service = ModulesService()

