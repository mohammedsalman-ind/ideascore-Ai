from fastapi import APIRouter, HTTPException
from typing import List
from backend.app.schemas.improvement import ImprovedSolution
from backend.app.database.store import store
from backend.app.services.improvement_service import improvement_service

router = APIRouter(prefix="/api/solutions", tags=["Fix My Idea"])

@router.post("/{solution_id}/improve", response_model=ImprovedSolution)
async def fix_solution(solution_id: str):
    """
    Fix My Idea Engine:
    Uses Gemini to generate an improved version addressing roast critique & research gaps.
    Re-evaluates deterministically, compares Original Score vs Improved Score, and logs version history.
    """
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

    roast = store.get_roast(solution_id)
    if not roast:
        # If user hasn't roasted yet, auto-roast first so improvement has rich critique data!
        from backend.app.services.roast_service import roast_service
        roast = await roast_service.roast_solution(target_sol)
        store.save_roast(solution_id, roast)

    research = target_job.research_data.get(solution_id)
    original_eval = target_job.evaluations.get(solution_id)

    improved = await improvement_service.fix_solution(
        original_solution=target_sol,
        roast=roast,
        problem=target_job.problem_understanding,
        research=research,
        original_eval=original_eval
    )

    store.save_improvement(solution_id, improved)
    return improved

@router.get("/{solution_id}/versions", response_model=List[ImprovedSolution])
async def get_solution_versions(solution_id: str):
    """Retrieves all improved versions and score deltas for a solution."""
    return store.get_improvements(solution_id)

