import json
import logging
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime
from backend.app.schemas.analysis import AnalysisJob, AnalysisHistorySummary, Solution, EvaluationResult
from backend.app.schemas.roast import CombinedRoastReport
from backend.app.schemas.improvement import ImprovedSolution
from backend.app.core.config import settings

logger = logging.getLogger(__name__)

class DataStore:
    def __init__(self):
        self.jobs: Dict[str, AnalysisJob] = {}
        self.roasts: Dict[str, CombinedRoastReport] = {} # solution_id -> CombinedRoastReport
        self.improvements: Dict[str, List[ImprovedSolution]] = {} # solution_id -> list of improved versions
        self._storage_file = Path(__file__).resolve().parent / "local_store.json"
        self._load_local()

    def _load_local(self):
        """Loads previously saved analyses from local storage if available."""
        if self._storage_file.exists():
            try:
                with open(self._storage_file, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    for j_id, j_data in data.get("jobs", {}).items():
                        self.jobs[j_id] = AnalysisJob(**j_data)
                    for r_id, r_data in data.get("roasts", {}).items():
                        self.roasts[r_id] = CombinedRoastReport(**r_data)
                    for s_id, s_list in data.get("improvements", {}).items():
                        self.improvements[s_id] = [ImprovedSolution(**i) for i in s_list]
                logger.info(f"Loaded {len(self.jobs)} saved analyses from local store.")
            except Exception as e:
                logger.warning(f"Failed to load local store: {e}")

    def _save_local(self):
        """Persists analyses to local disk."""
        try:
            data = {
                "jobs": {j_id: j.model_dump() for j_id, j in self.jobs.items()},
                "roasts": {r_id: r.model_dump() for r_id, r in self.roasts.items()},
                "improvements": {s_id: [i.model_dump() for i in s_list] for s_id, s_list in self.improvements.items()}
            }
            with open(self._storage_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.warning(f"Failed to persist store: {e}")

    def save_job(self, job: AnalysisJob):
        job.updated_at = datetime.utcnow().isoformat()
        self.jobs[job.id] = job
        self._save_local()

    def delete_job(self, job_id: str) -> bool:
        """Remove a job from the store. Returns True if deleted."""
        if job_id in self.jobs:
            del self.jobs[job_id]
            self._save_local()
            return True
        return False

    def get_job(self, job_id: str) -> Optional[AnalysisJob]:
        return self.jobs.get(job_id)

    def list_history(self) -> List[AnalysisHistorySummary]:
        history = []
        for j in sorted(self.jobs.values(), key=lambda x: x.created_at, reverse=True):
            top_name = "Analysis Pending"
            top_score = 0.0
            if j.rankings:
                top_name = j.rankings[0].solution.name
                top_score = j.rankings[0].score

            summary_text = j.problem_understanding.problem_summary if j.problem_understanding else j.problem_input.problem_text[:80]
            history.append(AnalysisHistorySummary(
                id=j.id,
                problem_summary=summary_text,
                original_problem=j.problem_input.problem_text,
                solution_count=len(j.solutions),
                top_solution_name=top_name,
                top_solution_score=top_score,
                created_at=j.created_at,
                stage=j.stage
            ))
        return history

    def save_roast(self, solution_id: str, roast: CombinedRoastReport):
        self.roasts[solution_id] = roast
        self._save_local()

    def get_roast(self, solution_id: str) -> Optional[CombinedRoastReport]:
        return self.roasts.get(solution_id)

    def save_improvement(self, solution_id: str, improvement: ImprovedSolution):
        if solution_id not in self.improvements:
            self.improvements[solution_id] = []
        self.improvements[solution_id].append(improvement)
        self._save_local()

    def get_improvements(self, solution_id: str) -> List[ImprovedSolution]:
        return self.improvements.get(solution_id, [])

store = DataStore()

