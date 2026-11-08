import asyncio
import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List, Dict, Any, Optional
from backend.app.schemas.analysis import (
    ProblemInput, AnalysisJob, SolutionRanking
)
from backend.app.services.gemini_service import gemini_service
from backend.app.services.tinyfish_service import tinyfish_service
from backend.app.services.scoring_service import scoring_service
from backend.app.database.store import store

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/analysis", tags=["Analysis"])

async def run_analysis_pipeline(job_id: str):
    """
    Background pipeline executing the 5 core stages:
    1. Understand Problem
    2. Generate Solutions
    3. TinyFish Market Research
    4. Gemini Evaluation + Backend Deterministic Scoring
    5. Final Recommendation & Ranking
    """
    job = store.get_job(job_id)
    if not job:
        return

    try:
        # Step 1: Understand the problem
        job.stage = "understanding"
        job.progress_percentage = 15
        job.status_message = "Analyzing problem domain, root causes, and target personas with Gemini..."
        store.save_job(job)

        understanding = await gemini_service.understand_problem(
            job.problem_input.problem_text,
            job.problem_input.additional_context
        )
        job.problem_understanding = understanding

        # Step 2: Generate 3-5 distinct solutions
        job.stage = "solutions_generated"
        job.progress_percentage = 35
        job.status_message = "Generating 4 structurally diverse solution architectures..."
        store.save_job(job)

        solutions = await gemini_service.generate_solutions(understanding, job.problem_input.problem_text)
        job.solutions = solutions

        # Step 3: TinyFish Market Research
        job.stage = "researching"
        job.progress_percentage = 60
        job.status_message = "TinyFish researching competitors, pricing, and live market citations..."
        store.save_job(job)

        research_tasks = []
        for sol in solutions:
            research_tasks.append(
                tinyfish_service.research_solution(
                    solution_id=sol.id,
                    solution_name=sol.name,
                    problem_domain=understanding.industry_domain,
                    core_features=sol.core_features
                )
            )

        research_results = await asyncio.gather(*research_tasks)
        for r in research_results:
            job.research_data[r.solution_id] = r

        # Step 4: Gemini Evaluation with deterministic backend weights
        job.stage = "evaluating"
        job.progress_percentage = 80
        job.status_message = "Gemini evaluating factors & backend calculating weighted scores..."
        store.save_job(job)

        eval_tasks = []
        for sol in solutions:
            res_data = job.research_data.get(sol.id)
            eval_tasks.append(
                gemini_service.evaluate_solution(sol, res_data, understanding)
            )

        eval_results = await asyncio.gather(*eval_tasks)
        for ev in eval_results:
            job.evaluations[ev.solution_id] = ev

        # Step 5: Rank solutions from highest to lowest
        job.progress_percentage = 95
        job.status_message = "Ranking solutions and synthesizing final investment recommendation..."
        store.save_job(job)

        ranked = sorted(solutions, key=lambda s: job.evaluations[s.id].weighted_score, reverse=True)
        rankings: List[SolutionRanking] = []
        for idx, s in enumerate(ranked):
            ev = job.evaluations[s.id]
            res = job.research_data.get(s.id)
            rankings.append(SolutionRanking(
                rank=idx + 1,
                solution=s,
                score=ev.weighted_score,
                confidence_level=ev.confidence_level,
                research_status=res.research_status if res else "completed",
                top_strengths=ev.strengths[:2],
                biggest_weakness=ev.weaknesses[0] if ev.weaknesses else "Market adoption hurdles",
                evaluation=ev,
                research=res
            ))
        job.rankings = rankings

        # Final Recommendation
        recommendation = await gemini_service.generate_final_recommendation(solutions, job.evaluations)
        job.final_recommendation = recommendation

        # Completion
        job.stage = "completed"
        job.progress_percentage = 100
        job.status_message = "Analysis complete. Ready for inspection, comparison, and roasting."
        store.save_job(job)

    except Exception as e:
        logger.error(f"Analysis pipeline failed for {job_id}: {str(e)}", exc_info=True)
        job.stage = "failed"
        job.error = str(e)
        job.status_message = f"Error during analysis: {str(e)}"
        store.save_job(job)

@router.post("", response_model=Dict[str, Any])
async def create_analysis(input_data: ProblemInput, background_tasks: BackgroundTasks):
    """Submits a new problem and starts the end-to-end analysis workflow."""
    job = AnalysisJob(
        problem_input=input_data,
        stage="created",
        progress_percentage=5,
        status_message="Analysis job queued"
    )
    store.save_job(job)
    background_tasks.add_task(run_analysis_pipeline, job.id)
    return {"analysis_id": job.id, "stage": job.stage, "status_message": job.status_message}

@router.get("/history")
async def get_history():
    """Returns saved analysis history."""
    return store.list_history()

@router.get("/{analysis_id}", response_model=AnalysisJob)
async def get_analysis(analysis_id: str):
    """Retrieves full analysis status and structured results."""
    job = store.get_job(analysis_id)
    if not job:
        raise HTTPException(status_code=404, detail="Analysis job not found")
    return job

@router.post("/{analysis_id}/retry")
async def retry_analysis(analysis_id: str, background_tasks: BackgroundTasks):
    """Retries a failed analysis job."""
    job = store.get_job(analysis_id)
    if not job:
        raise HTTPException(status_code=404, detail="Analysis job not found")
    job.stage = "created"
    job.progress_percentage = 5
    job.error = None
    job.status_message = "Restarting analysis..."
    store.save_job(job)
    background_tasks.add_task(run_analysis_pipeline, job.id)
    return {"analysis_id": job.id, "stage": job.stage, "status_message": job.status_message}

