from fastapi import APIRouter, HTTPException
from backend.app.schemas.modules import SolutionComparisonRequest, ComparisonReport
from backend.app.database.store import store
from backend.app.services.comparison_service import comparison_service

router = APIRouter(prefix="/api/solutions", tags=["Comparison"])

@router.post("/compare", response_model=ComparisonReport)
async def compare_solutions(request: SolutionComparisonRequest):
    """Compares 2 to 5 selected solutions across criteria with category winners and qualitative trade-offs."""
    matched_solutions = []
    matched_evals = {}

    for s_id in request.solution_ids:
        found = False
        for job in store.jobs.values():
            for s in job.solutions:
                if s.id == s_id:
                    matched_solutions.append(s)
                    if s_id in job.evaluations:
                        matched_evals[s_id] = job.evaluations[s_id]
                    found = True
                    break
            if found:
                break

    if len(matched_solutions) < 2:
        raise HTTPException(status_code=400, detail="Must provide at least 2 valid solution IDs to compare.")

    report = await comparison_service.compare_solutions(matched_solutions, matched_evals)
    return report

