from fastapi import APIRouter, HTTPException
from backend.app.schemas.roast import CombinedRoastReport
from backend.app.database.store import store
from backend.app.services.roast_service import roast_service

router = APIRouter(prefix="/api/solutions", tags=["Roast My Idea"])

@router.post("/{solution_id}/roast", response_model=CombinedRoastReport)
async def roast_solution(solution_id: str):
    """
    Triggers the multi-model roast engine:
    Groq (Brutally Honest Critic) + Gemini (Strategic Critic) executed in parallel.
    Produces combined critique, points of agreement/disagreement, and Reality Check Score.
    """
    target_sol = None
    for job in store.jobs.values():
        for s in job.solutions:
            if s.id == solution_id:
                target_sol = s
                break
        if target_sol:
            break

    if not target_sol:
        raise HTTPException(status_code=404, detail="Solution not found")

    report = await roast_service.roast_solution(target_sol)
    store.save_roast(solution_id, report)
    return report

@router.get("/{solution_id}/roast", response_model=CombinedRoastReport)
async def get_roast(solution_id: str):
    """Retrieves an already generated roast report if available."""
    report = store.get_roast(solution_id)
    if not report:
        raise HTTPException(status_code=404, detail="No roast report found for this solution. Click 'Roast My Idea' first.")
    return report

