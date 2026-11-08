from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from backend.app.schemas.modules import (
    MarketGapItem, FeasibilityReport, BusinessModelOption,
    SWOTReport, CustomerValidationReport, SharkTankMessage, SharkTankPitchRequest
)
from backend.app.database.store import store
from backend.app.services.modules_service import modules_service

router = APIRouter(prefix="/api/modules", tags=["Additional Intelligence Modules"])

class SolutionTargetRequest(BaseModel):
    solution_id: str

def _find_solution_and_job(solution_id: str):
    for job in store.jobs.values():
        for s in job.solutions:
            if s.id == solution_id:
                return s, job
    return None, None

@router.post("/market-gaps", response_model=List[MarketGapItem])
async def get_market_gaps(req: SolutionTargetRequest):
    """Discovers white space opportunities competitors are failing to address."""
    solution, job = _find_solution_and_job(req.solution_id)
    if not solution or not job:
        raise HTTPException(status_code=404, detail="Solution not found")

    research = job.research_data.get(solution.id)
    return await modules_service.find_market_gaps(solution, job.problem_understanding, research)

@router.post("/feasibility", response_model=FeasibilityReport)
async def get_feasibility(req: SolutionTargetRequest):
    """Evaluates development effort, tech stack, and engineering complexity."""
    solution, job = _find_solution_and_job(req.solution_id)
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")

    return await modules_service.analyze_feasibility(solution)

@router.post("/business-models", response_model=List[BusinessModelOption])
async def get_business_models(req: SolutionTargetRequest):
    """Evaluates and compares business models (Freemium, B2B, Usage, etc.)."""
    solution, job = _find_solution_and_job(req.solution_id)
    if not solution or not job:
        raise HTTPException(status_code=404, detail="Solution not found")

    return await modules_service.generate_business_models(solution, job.problem_understanding)

@router.post("/swot", response_model=SWOTReport)
async def get_swot(req: SolutionTargetRequest):
    """Generates SWOT analysis based on market intelligence."""
    solution, job = _find_solution_and_job(req.solution_id)
    if not solution or not job:
        raise HTTPException(status_code=404, detail="Solution not found")

    research = job.research_data.get(solution.id)
    return await modules_service.generate_swot(solution, research)

@router.post("/customer-validation", response_model=CustomerValidationReport)
async def get_customer_validation(req: SolutionTargetRequest):
    """Generates customer interview questions, surveys, and low-cost smoke test ideas."""
    solution, job = _find_solution_and_job(req.solution_id)
    if not solution or not job:
        raise HTTPException(status_code=404, detail="Solution not found")

    return await modules_service.generate_customer_validation(solution, job.problem_understanding)

@router.post("/shark-tank", response_model=List[SharkTankMessage])
async def pitch_shark_tank(req: SharkTankPitchRequest):
    """Interactive AI Shark Tank investor interrogation and pitch practice."""
    solution, job = _find_solution_and_job(req.solution_id)
    if not solution:
        raise HTTPException(status_code=404, detail="Solution not found")

    return await modules_service.pitch_shark_tank(solution, req.user_pitch_message, req.conversation_history)

