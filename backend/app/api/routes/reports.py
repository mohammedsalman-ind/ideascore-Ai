from fastapi import APIRouter, HTTPException, Response
from backend.app.database.store import store
from backend.app.services.report_service import report_service

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/{analysis_id}/pdf")
async def export_pdf(analysis_id: str):
    """Generates and downloads a clean, professional investment-grade PDF report."""
    job = store.get_job(analysis_id)
    if not job:
        raise HTTPException(status_code=404, detail="Analysis not found")

    pdf_bytes = report_service.generate_pdf(job)
    filename = f"IdeaScore_Report_{analysis_id[:8]}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

