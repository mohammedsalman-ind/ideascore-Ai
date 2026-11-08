import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

import asyncio
import logging
from backend.app.schemas.analysis import ProblemInput
from backend.app.api.routes.analysis import create_analysis, run_analysis_pipeline, get_analysis
from backend.app.api.routes.roast import roast_solution
from backend.app.api.routes.improvement import fix_solution
from backend.app.api.routes.comparison import compare_solutions
from backend.app.schemas.modules import SolutionComparisonRequest
from backend.app.services.report_service import report_service
from backend.app.services.modules_service import modules_service
from backend.app.database.store import store

logging.basicConfig(level=logging.INFO)

async def test_full_flow():
    print("=== Testing IdeaScore AI End-to-End ===")

    # 1. Submit problem
    prob_input = ProblemInput(
        problem_text="I find it difficult to manage college assignments, deadlines, and group projects in one place.",
        target_region="Global",
        budget_constraint="Bootstrapped / Student"
    )

    print("\n1. Running pipeline for problem...")
    from backend.app.schemas.analysis import AnalysisJob
    job = AnalysisJob(problem_input=prob_input)
    store.save_job(job)

    await run_analysis_pipeline(job.id)
    finished_job = store.get_job(job.id)

    assert finished_job.stage == "completed", f"Job failed: {finished_job.error}"
    print(f"Pipeline completed successfully: {finished_job.status_message}")
    print(f"Problem Summary: {finished_job.problem_understanding.problem_summary}")
    print(f"Domain: {finished_job.problem_understanding.industry_domain}")
    print(f"Solutions generated: {len(finished_job.solutions)}")

    for r in finished_job.rankings:
        print(f"Rank #{r.rank}: {r.solution.name} - Score: {r.score}/100 - UVP: {r.solution.unique_value_proposition[:60]}...")
        assert 0 <= r.score <= 100, "Score out of bounds"

    # 2. Test Roast My Idea
    top_sol = finished_job.rankings[0].solution
    print(f"\n2. Testing Multi-Model Roast on #{top_sol.name}...")
    roast_report = await roast_solution(top_sol.id)
    print(f"Reality Check Score: {roast_report.reality_check_score}/100")
    print(f"Brutal Verdict: {roast_report.brutal_verdict[:90]}...")
    print(f"Biggest Weakness: {roast_report.biggest_weakness}")
    print(f"Top failure modes count: {len(roast_report.top_five_failure_reasons)}")
    print(f"Points of agreement: {len(roast_report.points_of_agreement)}")

    # 3. Test Fix My Idea
    print(f"\n3. Testing Fix My Idea Engine on #{top_sol.name}...")
    improved = await fix_solution(top_sol.id)
    print(f"Original Score: {improved.original_score} -> Improved Score: {improved.improved_score} (Delta: +{improved.score_delta} pts)")
    print(f"Improved Name: {improved.name}")
    print(f"Changes Made: {len(improved.changes_made)}")
    assert improved.improved_score >= improved.original_score, "Improved score should be higher or equal"

    # 4. Test Comparison
    print("\n4. Testing Comparison Matrix across 3 solutions...")
    comp_req = SolutionComparisonRequest(solution_ids=[s.id for s in finished_job.solutions[:3]])
    comp_rep = await compare_solutions(comp_req)
    print(f"Category Winners: {len(comp_rep.category_winners)}")
    print(f"Easiest to build: {comp_rep.easiest_to_build[:70]}...")
    print(f"Strongest overall: {comp_rep.strongest_overall}")

    # 5. Test PDF Report Generation
    print("\n5. Testing PDF Report Generation...")
    pdf_bytes = report_service.generate_pdf(finished_job)
    print(f"PDF successfully generated: {len(pdf_bytes)} bytes")
    assert len(pdf_bytes) > 1000, "PDF buffer too small"

    # 6. Test Additional Modules
    print("\n6. Testing Market Gaps & Shark Tank...")
    gaps = await modules_service.find_market_gaps(top_sol, finished_job.problem_understanding, finished_job.research_data[top_sol.id])
    print(f"Market Gaps discovered: {len(gaps)}")

    shark_open = await modules_service.pitch_shark_tank(top_sol)
    print(f"Shark Tank initial investor challenges: {len(shark_open)}")

    print("\n ALL ACCEPTANCE TESTS PASSED!")

if __name__ == "__main__":
    asyncio.run(test_full_flow())
