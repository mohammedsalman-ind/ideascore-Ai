from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from backend.app.database.store import store
from backend.app.services.gemini_service import gemini_service

router = APIRouter(prefix="/api/solutions", tags=["Solutions"])

@router.get("/{solution_id}")
async def get_solution(solution_id: str):
    """Finds solution across stored analyses."""
    for job in store.jobs.values():
        for s in job.solutions:
            if s.id == solution_id:
                return {
                    "solution": s,
                    "evaluation": job.evaluations.get(s.id),
                    "research": job.research_data.get(s.id),
                    "analysis_id": job.id
                }
    raise HTTPException(status_code=404, detail="Solution not found")

@router.post("/{solution_id}/evaluate")
async def evaluate_single_solution(solution_id: str):
    """Re-runs deterministic evaluation for a single solution."""
    target_sol = None
    target_job = None
    for job in store.jobs.values():
        for s in job.solutions:
            if s.id == solution_id:
                target_sol = s
                target_job = job
                break
        if target_sol:
            break

    if not target_sol or not target_job:
        raise HTTPException(status_code=404, detail="Solution not found")

    research = target_job.research_data.get(solution_id)
    eval_res = await gemini_service.evaluate_solution(target_sol, research, target_job.problem_understanding)
    target_job.evaluations[solution_id] = eval_res
    store.save_job(target_job)
    return eval_res

